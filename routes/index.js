const Router = require('koa-router')
const UserController = require('../controllers/user')
const ArticleController = require('../controllers/article')
const CategoryController = require('../controllers/category')

const router = new Router({
    prefix: '/api/v1'
})

const checkToken = require('../token/checkToken.js');

const multer = require('koa-multer');//加载koa-multer模块
//配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage });

/**
 * ????
 */
// ????
router.post('/user/regist', UserController.create);
// ????
router.post('/user/login', UserController.login);
// ????
router.delete('/user/delete/:id', UserController.delete);
// ??????
router.post('/user/info', checkToken,UserController.getUserInfo);
// ??????
router.get('/user/list', UserController.getUserList);

router.post('/article/upload_pic', upload.single('file'), ArticleController.upload_pic)

router.post('/article/create_article', ArticleController.create)

router.post('/article/save_article', ArticleController.save)

router.post('/article/query_article', ArticleController.search)

router.post('/article/query_article_detail', ArticleController.detail)

router.post('/article/del_article', ArticleController.delete)

router.post('/category/create_category', CategoryController.create)

router.post('/category/get_category_list', CategoryController.list)

router.post('/category/update_category', CategoryController.update)

router.post('/category/del_category', CategoryController.delete)



module.exports = router
