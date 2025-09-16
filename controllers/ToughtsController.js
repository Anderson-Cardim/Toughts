const Tought = require('../models/Tought');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class ToughtsController {
    static async showToughts(req, res) {

        let search = '';

        if(req.query.search) {
            search = req.query.search;
        }

        let order = 'DESC';

        if(req.query.order === 'old') {
            order = 'ASC';
        } else {
            order = 'DESC';
        }

        const tougthsData = await Tought.findAll({
            include: User,
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            order: [['createdAt', order]],
        });

        const toughts = tougthsData.map((tought) => tought.get({ plain: true }));
       
        let toughtsQty = toughts.length;

        if(toughtsQty === 0) {
            toughtsQty = false;
        }

        res.render('toughts/home', { toughts, search, toughtsQty });
    }
     

    static async dashboard(req, res) {
        res.render('toughts/dashboard');
    }

    static async dashboard(req, res) {
        const userId = req.session.userid;

        const user = await User.findOne({
            where: { 
                id: userId 
            },
            include: Tought,
            plain: true,
        });

        if (!user) {
            res.redirect('/login');
        }

        const toughts = user.Toughts.map((tought) => tought.dataValues);
        console.log('Toughts:', toughts.length);

        let emptyToughts = false;

        if (toughts.length === 0) {
            emptyToughts = true;
        }

        console.log('Empty Toughts:', emptyToughts);

        res.render('toughts/dashboard', { toughts, emptyToughts });
    }

    static createTought(req, res) {
        res.render('toughts/create');
    }

    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            description: req.body.description,
            UserId: req.session.userid
        }

        try{
            await Tought.create(tought)
            req.flash('message', 'Pensamento criado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            });
        } catch (err) {
            console.error('Erro ao criar pensamento:', err);
        }

    }

    static async removeTought(req, res) {
        const id = req.body.id;
        const userId = req.session.userid;

        try {
            await Tought.destroy({ where: { id: id , userid: userId} });
            req.flash('message', 'Pensamento removido com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            });
        } catch (err) {
            console.error('Erro ao remover pensamento:', err);
            res.status(500).send('Erro ao remover pensamento.');
        }
    }

    static async updateTought(req, res) {
        const id = req.params.id;

        const tought = await Tought.findOne({ where: { id: id }, raw: true });

        console.log('Tought to edit:', tought);
        res.render('toughts/edit', { tought });
    }

    static async updateToughtSave(req, res) {
        const id = req.body.id;
        const toughtData = {
            title: req.body.title,
        };

        try {
            await Tought.update(toughtData, { where: { id: id } });
            req.flash('message', 'Pensamento atualizado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            });
        } catch (err) {
            console.error('Erro ao atualizar pensamento:', err);
        }
    }
}