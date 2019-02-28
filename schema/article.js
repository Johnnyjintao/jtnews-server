const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article', {
        // 文章ID
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
        },
        // 文章标题
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
        },
        // 文章作者
        author: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'author',
        },
        // 文章状态  0草稿  1已发布 2已撤回
        state: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'state',
        },
        // 文章分类
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'categoryId'
        },
        // 文章封面
        banner: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'banner'
        },
        // 文章内容
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'content'
        },
        // 浏览次数
        browser: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'browser',
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })

}