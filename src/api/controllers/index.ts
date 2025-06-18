/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from '../decorators/database';

@connectDB
class BaseController {
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  async create(data: any) {
    return this.model.create(data);
  }

  async getAll() {
    return this.model.find();
  }

  async find(filter: any) {
    return this.model.find(filter);
  }

  async findOne(filter: any) {
    return this.model.findOne(filter);
  }

  async paginate(
    perPage = 10,
    page = 1,
    sort = { createdAt: -1 } as any,
    filter = {} as any,
    search = '' as string,
  ) {
    const searchOptions = [{ name: { $regex: search, $options: 'i' } }];

    return this.model.aggregate([
      {
        $match: {
          ...filter,
          ...(search ? { $or: searchOptions } : {}),
        },
      },
      {
        $facet: {
          data: [
            { $sort: sort },
            { $skip: (page - 1) * perPage },
            { $limit: perPage },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
  }

  async count(filter = {} as any) {
    return this.model.countDocuments(filter);
  }

  async getById(id: string) {
    return this.model.findById(id);
  }

  async updateById(id: string, data: any) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async deleteMany(filter: any) {
    return this.model.deleteMany(filter, {
      new: true,
    });
  }

  async updateMany(filter: any, data: any) {
    return this.model.updateMany(filter, data, {
      new: true,
    });
  }
}

export default BaseController;
