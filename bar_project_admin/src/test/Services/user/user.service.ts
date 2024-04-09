import { UserDataService } from '../../DataServices/userData.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../Dto/user/create-user.dto';
import { UpdateUserDto } from '../../Dto/user/update-user.dto';


@Injectable()
export class UserService {
  constructor(private userDataService: UserDataService){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(req) {
    try{
      console.log("email: ", req.email)
      const user = await this.userDataService.findUser(req.email)
      console.log(user)
      return {
        isEmailConfirmed: user.isEmailConfirmed
      }
    }catch(error){
      console.error("Error finding user: ", error.message);
      return {error: error.message}
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
