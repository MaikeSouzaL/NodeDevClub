import { Model, Sequelize } from 'sequelize';
import PORT from '../../configPort';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:${PORT}/product-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }
  // vamos iniciar a relação entre a tabela de products com a tabela de Category
  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}
export default Product;
