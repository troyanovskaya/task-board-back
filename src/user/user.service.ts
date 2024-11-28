import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
@Injectable()
export class UserService {
  async registerUser(registerUser: RegisterUserDto) {
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        email: registerUser.email,
        password: registerUser.password,
      });

      return userRecord;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: error.message,
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
  async loginUser(payload: LoginDto) {
    const { email, password } = payload;
    try {
      const {displayName, localId, idToken, refreshToken, expiresIn } =
        await this.signInWithEmailAndPassword(email, password);
      return { displayName, email, localId, idToken, refreshToken, expiresIn };
    } catch (error) {
      let mess = 'Something went wrong';
      console.log(error.response)
      if(error.response.error == 'ERR_INVALID_URL'){
        mess = 'Server error, try later';
      } else if(error.response.error == 'ERR_BAD_REQUEST'){
        mess = 'Invalid login credentials';
      }
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        //error: error.response.data.error.message,
        error: mess
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
  private async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.APIKEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }

  private async sendPostRequest(url: string, data: any) {
    try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
      return response.data;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        //error: error.response.data.error.message,
        error: error.code
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

}
