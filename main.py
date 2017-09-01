import os.path
import tornado.escape
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import base64
import json

from bson import ObjectId
from pymongo import MongoClient
from tornado.options import define, options

define("port", default=8000, help="run on the given port", type=int)

MONGODB_DB_URL = os.environ.get('OPENSHIFT_MONGODB_DB_URL') if os.environ.get(
    'OPENSHIFT_MONGODB_DB_URL') else 'mongodb://localhost:27017/'
MONGODB_DB_NAME = os.environ.get('OPENSHIFT_APP_NAME') if os.environ.get('OPENSHIFT_APP_NAME') else 'iflytek'

client = MongoClient(MONGODB_DB_URL)
db = client[MONGODB_DB_NAME]


class IndexHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        self.render("index.html")


# 处理工具页面的请求
class ToolHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        param = self.get_argument("param", None)
        if param is not None:
            if param == "get_articles":
                offset = self.get_argument("offset", None)
                limit = self.get_argument("limit", None)
                if offset is not None and limit is not None:
                    article_class = self.get_argument("article_class", None)
                    if article_class is not None:
                        results = db.article.tools.find({"articleClass": article_class}).skip(int(offset)).limit(
                            int(limit))
                    else:
                        results = db.article.tools.find().skip(int(offset)).limit(int(limit))
                    articles = []
                    for a in results:
                        a["_id"] = a["_id"].__str__()
                        articles.append(a)
                    print(articles)
                    articles = json.dumps(articles)
                    self.write(articles)
            elif param == "article_class":
                results = db.article_class.tools.find()
                article_classes = []
                for r in results:
                    r["_id"] = r["_id"].__str__()
                    article_classes.append(r)
                article_classes = json.dumps(article_classes)
                print(article_classes)
                self.write(article_classes)
        else:
            self.render("tools.html")


# 处理文章页面的请求
class ArticleHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        article_id = self.get_argument("article_id")
        print("id = " + article_id)
        article = db.article.tools.find_one({"_id": ObjectId(str(article_id))})
        print(article)
        title = article["articleTitle"]
        content = article["articleContent"]
        date = article["articleDate"]
        desription = article["articleDescription"]
        writer = article["articleWriter"]
        article_class = article["articleClass"]
        self.render("article.html", articleTitle=title, articleContent=content, articleDate=date, articleWriter=writer,
                    articleClass=article_class)


class AddArticleHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self, *args, **kwargs):
        self.render("add_article.html")

    def post(self, *args, **kwargs):
        data = self.request.body
        data_decode = json.loads(data)
        print(data_decode)

        # 由于上传的数据进行了base64编码，所以这里需要对数据进行解码然后存入数据库
        description = data_decode['articleDescription'] = base64.b64decode(data_decode['articleDescription']).decode(
            "utf-8")
        title = data_decode['articleTitle'] = base64.b64decode(data_decode['articleTitle']).decode("utf-8")
        writer = data_decode['articleWriter'] = base64.b64decode(data_decode['articleWriter']).decode("utf-8")
        article_class = data_decode['articleClass'] = base64.b64decode(data_decode['articleClass']).decode("utf-8")
        date = data_decode['articleDate']
        content = data_decode['articleContent'] = base64.b64decode(data_decode['articleContent']).decode("utf-8")
        article_id = db.article.tools.insert(data_decode)
        db.article_class.tools.update({"articleClass": article_class}, {'$inc': {"articleClassCount": 1}}, True)
        # self.render("article.html", articleTitle=title, articleContent=content, articleDate=date,
        # articleWriter=writer, articleClass=article_class)
        self.write(str(article_id))


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", IndexHandler),
            (r"/tools.html", ToolHandler),
            (r"/article", ArticleHandler),
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
