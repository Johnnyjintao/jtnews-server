const db = require('../config/db');
const Sequelize = db.sequelize;
const Category = Sequelize.import('../schema/category');
const Article = Sequelize.import('../schema/article');

Category.sync({force: false});

class CategoryModel {
    /**
     * 创建分类
     * @param data
     * @returns {Promise<*>}
     */
    static async createCategory(data) {
        return await Category.create({
            name: data.name
        })
    }

    /**
     * 查询分类名称是否存在
     * @param data
     * @returns {Promise<*>}
     */
    static async findCategoryByname(data) {
        return await Category.findAll({
            where:{name:data}
        })
    }



    /**
     * 更新分类数据
     * @param id  分类ID
     * @param data  事项的状态
     * @returns {Promise.<boolean>}
     */
    static async updateCategory(id, data) {
        await Category.update({
            name: data.name
        }, {
            where: {
                id
            },
            fields: ['name']
        });
        return true
    }

    /**
     * 获取分类列表
     * @returns {Promise<*>}
     */
    static async getCategoryList(limit,offset,name) {
        let obj = {};
        if(name)
            obj.name = {[Sequelize.Op.like]:"%"+name+"%"};
        return await Category.findAll({
            attributes: ['id', 'name'],
            limit,
            offset,
            where:obj
        })
    }

    // 查询ID分类下的所有文章
    static async getCategoryArticleList(id) {
        return await Category.findAll({
            where: {
                id,
            },
            include: [{
                model: Article
            }]
        })
    }

    /**
     * 获取分类详情数据
     * @param id  文章ID
     * @returns {Promise<Model>}
     */
    static async getCategoryDetail(id) {
        return await Category.findOne({
            where: {
                id,
            },
        })
    }

    /**
     * 删除分类
     * @param id
     * @returns {Promise.<boolean>}
     */
    static async deleteCategory(id) {
        await Category.destroy({
            where: {
                id,
            }
        })
        return true
    }

}

module.exports = CategoryModel
