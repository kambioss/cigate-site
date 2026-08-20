import { Hono } from 'hono'
import { authRoutes } from './routes/auth.js'
import { newsPublicRoutes, newsAdminRoutes } from './routes/news.js'
import { mediaPublicRoutes, mediaAdminRoutes } from './routes/media.js'

const app = new Hono()

app.route('/api/admin/auth', authRoutes)
app.route('/api/news', newsPublicRoutes)
app.route('/api/admin/news', newsAdminRoutes)
app.route('/api/admin/media', mediaAdminRoutes)
app.route('/media', mediaPublicRoutes)

export default app
