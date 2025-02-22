import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
@Injectable()
export class UserService {
  transformUsers(data: Record<string, any>): any[] {
    return Object.entries(data).map(([id, user]) => ({
      ...user
    }));
  }
  transformTasks(data: Record<string, any>): any[] {
    if(data){
      return Object.entries(data).map(([id, task]) => ({
        id, // Use the key as the 'id' property
        ...task, // Spread the task properties
      }));
    } else {
      return [];
    }
  }
  async registerUser(registerUser: RegisterUserDto) {
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        email: registerUser.email,
        password: registerUser.password,
      });
      const newUserRef = firebaseAdmin.database().ref('users').push();
      await newUserRef.set({
        login: registerUser.login,
        email: registerUser.email,
        id: userRecord.uid
      })
      return {id: userRecord.uid};

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: error.message,
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
  async checkIfEmailIsUsed(email){
    try{
      const userRef = firebaseAdmin.database().ref('users');
      const snapshot = await userRef.once('value'); // Fetch the data once
      const users = this.transformUsers(snapshot.val());
      const sortedUsers = users.filter( (el) =>{
        return el.email === email;
      })
      if(sortedUsers[0]){
        return {exist: sortedUsers.length === 1, email: sortedUsers[0].email, id:sortedUsers[0].id};
      }
      return {exist: sortedUsers.length === 1, email: null, id:null};
    } catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }

  }
  async getEmailById(userId:string){
    try {
      const userRef = firebaseAdmin.database().ref('users');
      const taskRef = firebaseAdmin.database().ref('tasks');
      const snapshot = await userRef.once('value'); // Fetch the data once
      const taskSnapshot = await taskRef.once('value');
      const users = this.transformUsers(snapshot.val());
      const tasks = this.transformTasks(taskSnapshot.val());

      const userTask = [];
      users.forEach( (el) =>{
        if(el.id === userId){
          const t = tasks.filter( task =>{
            return (task.userId === userId);
          })
          userTask.push({email: el.email, tasks: t, id: userId})
        }
      })
      return userTask;
    } catch (error) {
      let mess = 'Something went wrong';
      mess = 'Invalid id';
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        //error: error.response.data.error.message,
        error: mess
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
