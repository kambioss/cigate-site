import contextlib
import io
import tempfile
import unittest
from email.message import EmailMessage
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import repondre_candidatures as app


class FakeMailbox:
    def __enter__(self):
        return self

    def __exit__(self, *_):
        return False

    def login(self, *_):
        return "OK", []

    def select(self, folder, readonly=False):
        assert folder == "Candidatures" and readonly
        return "OK", [b"1"]

    def response(self, name):
        assert name == "UIDVALIDITY"
        return "UIDVALIDITY", [b"42"]

    def uid(self, command, *args):
        if command == "search":
            return "OK", [b"7"]
        assert command == "fetch" and args[0] == b"7"
        message = EmailMessage()
        message["From"] = "Alice <alice@example.org>"
        message["Subject"] = "Candidature géomaticienne"
        message["Message-ID"] = "<application-7@example.org>"
        return "OK", [(b"7 (BODY[HEADER]", message.as_bytes())]

    def close(self):
        pass


class ReplyTests(unittest.TestCase):
    def test_filters_automatic_messages(self):
        message = EmailMessage()
        message["From"] = "Robot <robot@example.org>"
        message["Auto-Submitted"] = "auto-replied"
        self.assertIsNone(app.candidate_address(message, "recrutement@example.org"))

    def test_preview_confirmation_and_duplicate_protection(self):
        env = {
            "CANDIDATURE_EMAIL": "recrutement@example.org",
            "CANDIDATURE_PASSWORD": "test-password",
            "CANDIDATURE_FOLDER": "Candidatures",
            "CANDIDATURE_ORGANISATION": "CIGATE",
        }
        with tempfile.TemporaryDirectory() as directory:
            state = Path(directory) / "state.sqlite3"
            preview = SimpleNamespace(approve=None, limit=20, state=state, smtp_port=587)
            approve = SimpleNamespace(approve="7", limit=20, state=state, smtp_port=587)
            output = io.StringIO()
            with patch.dict("os.environ", env), patch.object(app.imaplib, "IMAP4_SSL", return_value=FakeMailbox()), patch.object(app, "send_reply") as send, contextlib.redirect_stdout(output):
                app.run(preview)
                self.assertIn("UID 7", output.getvalue())
                self.assertIn("alice@example.org", output.getvalue())
                send.assert_not_called()
                with patch("builtins.input", return_value="non"):
                    app.run(approve)
                send.assert_not_called()
                with patch("builtins.input", return_value="oui"):
                    app.run(approve)
                send.assert_called_once()
                sent_message = send.call_args.args[0]
                self.assertEqual(sent_message["To"], "alice@example.org")
                self.assertEqual(sent_message["In-Reply-To"], "<application-7@example.org>")
                app.run(approve)
                send.assert_called_once()


if __name__ == "__main__":
    unittest.main()
