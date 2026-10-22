#!/usr/bin/env python3
"""Préparer des réponses aux candidatures placées dans un dossier IMAP Infomaniak.

Chaque envoi exige la sélection d'un UID et une confirmation interactive.
"""

import argparse
import imaplib
import os
import re
import smtplib
import sqlite3
import ssl
import sys
from datetime import datetime, timezone
from email import policy
from email.message import EmailMessage
from email.parser import BytesParser
from email.utils import parseaddr
from pathlib import Path


HOST = "mail.infomaniak.com"
SUBJECT = "Accusé de réception de votre candidature"
EMAIL_RE = re.compile(r"^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$")


def config():
    address = os.environ.get("CANDIDATURE_EMAIL", "").strip()
    password = os.environ.get("CANDIDATURE_PASSWORD", "")
    folder = os.environ.get("CANDIDATURE_FOLDER", "").strip()
    organisation = os.environ.get("CANDIDATURE_ORGANISATION", "CIGATE").strip()
    if not EMAIL_RE.fullmatch(address) or not password or not folder or not organisation:
        raise ValueError(
            "Renseignez CANDIDATURE_EMAIL, CANDIDATURE_PASSWORD, "
            "CANDIDATURE_FOLDER et, si nécessaire, CANDIDATURE_ORGANISATION."
        )
    return address, password, folder, organisation


def candidate_address(message, own_address):
    """Ne jamais répondre aux listes, robots ou adresses ambiguës."""
    if message.get("Auto-Submitted", "no").lower() != "no":
        return None
    if message.get("Precedence", "").lower() in {"bulk", "junk", "list"}:
        return None
    if message.get("List-Id") or message.get("List-Unsubscribe"):
        return None
    if message.get("Return-Path", "").strip() == "<>":
        return None
    addresses = message.get_all("From", [])
    if len(addresses) != 1:
        return None
    name, address = parseaddr(str(addresses[0]))
    if not EMAIL_RE.fullmatch(address) or address.lower() == own_address.lower():
        return None
    return name, address


def make_reply(message, recipient, own_address, organisation):
    name, address = recipient
    reply = EmailMessage()
    reply["From"] = own_address
    reply["To"] = address
    reply["Subject"] = SUBJECT
    message_id = str(message.get("Message-ID", "")).strip()
    if message_id and "\n" not in message_id and "\r" not in message_id:
        reply["In-Reply-To"] = message_id
        references = str(message.get("References", "")).strip()
        reply["References"] = f"{references} {message_id}".strip() if references else message_id
    reply["Auto-Submitted"] = "auto-replied"
    greeting = f"Bonjour {name}," if name and len(name) <= 100 else "Bonjour,"
    reply.set_content(
        f"{greeting}\n\n"
        "Nous accusons réception de votre candidature et vous remercions de l'intérêt "
        "que vous portez à notre organisation.\n\n"
        "Nous examinerons votre dossier et vous contacterons si votre profil correspond "
        "aux besoins du poste.\n\n"
        f"Cordialement,\nL'équipe {organisation}\n"
    )
    return reply


def send_reply(reply, address, password, port):
    context = ssl.create_default_context()
    if port == 465:
        with smtplib.SMTP_SSL(HOST, port, timeout=30, context=context) as smtp:
            smtp.login(address, password)
            smtp.send_message(reply)
    else:
        with smtplib.SMTP(HOST, port, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(address, password)
            smtp.send_message(reply)


def open_state(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.execute(
        """CREATE TABLE IF NOT EXISTS replies (
            folder TEXT NOT NULL,
            uidvalidity TEXT NOT NULL,
            uid TEXT NOT NULL,
            address TEXT NOT NULL,
            status TEXT NOT NULL,
            recorded_at TEXT NOT NULL,
            PRIMARY KEY (folder, uidvalidity, uid)
        )"""
    )
    connection.commit()
    return connection


def run(args):
    address, password, folder, organisation = config()
    state = open_state(args.state)
    try:
        with imaplib.IMAP4_SSL(HOST, 993, timeout=30) as mailbox:
            mailbox.login(address, password)
            status, _ = mailbox.select(folder, readonly=True)
            if status != "OK":
                raise RuntimeError(f"Dossier IMAP introuvable : {folder}")
            _, validity = mailbox.response("UIDVALIDITY")
            if not validity or not validity[0]:
                raise RuntimeError("UIDVALIDITY IMAP indisponible ; arrêt pour éviter les doublons")
            uidvalidity = validity[0].decode("ascii")
            status, data = mailbox.uid("search", None, "UNSEEN")
            if status != "OK":
                raise RuntimeError("Recherche IMAP échouée")
            uids = [args.approve.encode("ascii")] if args.approve else data[0].split()
            if not args.approve:
                print(f"{len(uids)} message(s) non lu(s) dans {folder}.")
            examined = 0
            for uid in uids:
                uid_text = uid.decode("ascii")
                existing = state.execute(
                    "SELECT status FROM replies WHERE folder=? AND uidvalidity=? AND uid=?",
                    (folder, uidvalidity, uid_text),
                ).fetchone()
                if existing:
                    print(f"UID {uid_text} : déjà {existing[0]}, ignoré.")
                    continue
                if not args.approve and examined >= args.limit:
                    break
                examined += 1
                status, parts = mailbox.uid("fetch", uid, "(BODY.PEEK[HEADER])")
                if status != "OK":
                    print(f"UID {uid_text} : lecture échouée, ignoré.", file=sys.stderr)
                    continue
                raw = next((item[1] for item in parts if isinstance(item, tuple)), None)
                if not raw:
                    print(f"UID {uid_text} : message introuvable.", file=sys.stderr)
                    continue
                message = BytesParser(policy=policy.default).parsebytes(raw)
                recipient = candidate_address(message, address)
                if not recipient:
                    print(f"UID {uid_text} : expéditeur automatique ou invalide, ignoré.")
                    continue
                reply = make_reply(message, recipient, address, organisation)
                print(f"\nUID {uid_text} | De : {recipient[1]} | Objet reçu : {message.get('Subject', '')}")
                print(f"Réponse proposée à {recipient[1]} :\n{reply.get_content()}")
                if not args.approve:
                    continue
                try:
                    confirmation = input(f"Envoyer cette réponse pour UID {uid_text} ? Tapez oui : ")
                except EOFError:
                    confirmation = ""
                if confirmation.strip().lower() != "oui":
                    print("Envoi annulé.")
                    continue
                now = datetime.now(timezone.utc).isoformat()
                try:
                    state.execute(
                        "INSERT INTO replies VALUES (?, ?, ?, ?, 'pending', ?)",
                        (folder, uidvalidity, uid_text, recipient[1], now),
                    )
                    state.commit()
                except sqlite3.IntegrityError:
                    print(f"UID {uid_text} : déjà réservé, ignoré.")
                    continue
                # En cas d'erreur SMTP incertaine, conserver 'pending' : une vérification
                # manuelle évite d'envoyer potentiellement deux accusés de réception.
                send_reply(reply, address, password, args.smtp_port)
                state.execute(
                    "UPDATE replies SET status='sent', recorded_at=? "
                    "WHERE folder=? AND uidvalidity=? AND uid=?",
                    (datetime.now(timezone.utc).isoformat(), folder, uidvalidity, uid_text),
                )
                state.commit()
                print(f"UID {uid_text} : accusé envoyé à {recipient[1]}.")
            mailbox.close()
    finally:
        state.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--approve", metavar="UID", help="Choisir un message à valider avant l'envoi")
    parser.add_argument("--limit", type=int, default=20, help="Nombre maximum de messages à afficher")
    parser.add_argument("--smtp-port", type=int, choices=(465, 587), default=587)
    parser.add_argument("--state", type=Path, default=Path(__file__).with_name(".candidatures.sqlite3"))
    args = parser.parse_args()
    if args.limit < 1:
        parser.error("--limit doit être positif")
    if args.approve and (not args.approve.isascii() or not args.approve.isdecimal()):
        parser.error("--approve attend un UID numérique")
    try:
        run(args)
    except (ValueError, OSError, imaplib.IMAP4.error, smtplib.SMTPException, RuntimeError) as error:
        parser.exit(1, f"Erreur : {error}\n")


if __name__ == "__main__":
    main()
