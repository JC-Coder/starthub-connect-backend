import { UserEntity } from 'src/modules/v1/users/entities/users.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserEntity, (faker) => {
    const user = new UserEntity();
    user.firstname = faker.name.firstName('male');
    user.lastname = faker.name.lastName('male');
    user.username = faker.internet.userName('male');
    user.password = faker.internet.password(30);
    user.email = faker.internet.email(user.firstname,user.lastname);
    user.phone_number = faker.phone.number('string');
    user.is_top_member = true;
    user.profile_image = faker.internet.avatar();

    return user;
})