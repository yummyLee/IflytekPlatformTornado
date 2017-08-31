import os.path
import tornado.escape
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options

define("port", default=8000, help="run on the given port", type=int)


class IndexHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        self.render("index.html")


class ToolHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        self.render("tools.html")


class ArticleHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        self.render("article.html")


class AddArticleHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        self.render("add_article.html")

    def post(self, *args, **kwargs):
        data = self.request.body
        print(data)
        self.redirect("article.html")


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", IndexHandler),
            (r"/tools.html", ToolHandler),
            (r"/article.html", ArticleHandler),
            (r"/add_article.html", AddArticleHandler)
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
            autoescape=None
        )
        tornado.web.Application.__init__(self, handlers, **settings)


if __name__ == "__main__":
    tornado.options.parse_command_line()
    server = tornado.httpserver.HTTPServer(Application())
    server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
