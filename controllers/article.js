const ArticleModel = require('../modules/article')
const db = require('../config/db');
const Sequelize = db.sequelize;
const Category = Sequelize.import('../schema/category');

const statusCode = require('../util/status-code')




class articleController {
    /**
     * 创建文章
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        if(req.state == 'draft' && req.title){
            if(req.article_id){
                await ArticleModel.updateArticle(req)
            }else{
                await ArticleModel.createArticle(req);
            }
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(200, '成功');
        }else if(req.state == 'article' && req.title && req.author && req.categoryId && req.banner && req.content){
            try {
                req.banner = JSON.stringify(req.banner);
                // 查询分类是否存在
                let categoryDetail = await Category.findOne({
                    where: {
                        id: req.categoryId,
                    },
                });
                if (categoryDetail) {
                    req.categoryId = categoryDetail.id;

                } else {
                    ctx.response.status = 412;
                    ctx.body = statusCode.ERROR_412('缺少此文章分类，请重新创建分类: ' + req.category)
                    return false;
                }
                if(req.article_id){
                    await ArticleModel.updateArticle(req)
                }else {
                    await ArticleModel.createArticle(req);
                }

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(200, '成功');

            } catch (err) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412({
                    msg: '创建失败',
                    err,
                })
            }
        }else{
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412({
                msg: '请检查参数！'
            })
        }
    }

    static async save(ctx) {
        let req = ctx.request.body;

        if (req.title && req.categoryId) {
            try {
                req.banner = JSON.stringify(req.banner);
                const ret = await ArticleModel.createArticle(req);
                const data = await ArticleModel.getArticleDetail(ret.id);

                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('保存文章成功', data);

            } catch (err) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412({
                    msg: '保存失败',
                    err,
                })
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412({
                msg: '请检查参数！'
            })
        }
    }

    //上传图片
    static async upload_pic(ctx){
        try {
            let data = {filename:ctx.host+'/images/'+ctx.req.file.filename}
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(200,'上传图片成功！', data)
        } catch (e) {
            console.log(e);
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e);
        }
    }



    static async search(ctx) {
        try {
            let req = ctx.request.body;
            let name = req.name || '';
            let offset = req.offset || 10;
            let limit = req.limit || 0;
            let data = await ArticleModel.search(name,offset,limit);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200(200,'查询文章成功！', data);
        } catch (e) {
            console.log(e);
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e);
        }
    }

    /**
     * 获取文章列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async list(ctx) {
        let params = ctx.query;
        try {
            const data = await ArticleModel.getArticleList(params);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('查询文章列表成功！', data)
        } catch (e) {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412(e);
        }
    }

    /**
     * 查询单条文章数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(ctx) {
        let req = ctx.request.body;
        let id = req.id;

        if (id) {
            try {
                let data = await ArticleModel.getArticleDetail(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200(200,'查询文章成功！', data);

            } catch (err) {
                ctx.response.status = 412;
                ctx.body = statusCode.ERROR_412({
                    mgs: '查询失败',
                    err,
                })
            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('文章ID必须传');
        }
    }


    /**
     * 删除文章数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let req = ctx.request.body;
        let id = req.id;

        if (id && !isNaN(id)) {
            try {
                await ArticleModel.deleteArticle(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('删除文章成功！');

            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200({
                    msg: '删除失败',
                    err,
                });

            }
        } else {
            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('文章ID必须传！');
        }
    }

    /**
     * 更新导航条数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        let req = ctx.request.body;
        let id = ctx.params.id;

        if (req) {
            await ArticleModel.updateArticle(id, req);
            let data = await ArticleModel.getArticleDetail(id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('更新文章成功！', data);
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('更新文章失败！')
        }
    }
}

module.exports = articleController
