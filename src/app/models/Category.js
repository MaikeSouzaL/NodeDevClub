import { Model, Sequelize } from 'sequelize';
import PORT from '../../configPort';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:${PORT}/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      },
    );
    return this;
  }
}
export default Category;
