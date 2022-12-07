import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/modules/v1/users/entities/users.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository =  dataSource.getRepository(UserEntity);
        // await repository.insert([
        //     {
        //         firstname: 'Caleb',
        //         lastname: 'Barrows',
        //         username: 'test',
        //         email: 'caleb.barrows@gmail.com',
        //         password: 'test'
        //     }
        // ]);

        // ---------------------------------------------------

        const userFactory = await factoryManager.get(UserEntity);

        // save 1 factory generated entity, to the database
        // await userFactory.save();

        // save 5 factory generated entities, to the database
        await userFactory.saveMany(40);
    }
}