import os.path
from pymongo import MongoClient

MONGODB_DB_URL = os.environ.get('OPENSHIFT_MONGODB_DB_URL') if os.environ.get(
    'OPENSHIFT_MONGODB_DB_URL') else 'mongodb://localhost:27017/'
MONGODB_DB_NAME = os.environ.get('OPENSHIFT_APP_NAME') if os.environ.get('OPENSHIFT_APP_NAME') else 'iflytek'

client = MongoClient(MONGODB_DB_URL)
db = client[MONGODB_DB_NAME]

print(MONGODB_DB_NAME)
print(db.collection_names())

# for i in range(100):
#     article = [{'articleTitle': '文章' + str(i), 'articleWriter': '作者' + str(i), 'articleClass': '分类' + str(i % 6),
#                 'articleDescription': '描述，描述，描述' + str(i),
#                 'articleDate': '2017-09-01 14:9:51', 'articleContent': '内容，内容，内容，内容' + str(i)}]
#     db.article.tools.insert(article)
#     db.article_class.tools.update({"articleClass": '分类' + str(i % 6)}, {'$inc': {"articleClassCount": 1}}, True)
