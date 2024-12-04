import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as firebaseAdmin from 'firebase-admin';
import { error } from 'console';

@Injectable()
export class TaskService {
  transformTasks(data: Record<string, any>): any[] {
    return Object.entries(data).map(([id, task]) => ({
      id, // Use the key as the 'id' property
      ...task, // Spread the task properties
    }));
  }
  async create(createTaskDto: CreateTaskDto) {
    try{
      const newTaskRef = firebaseAdmin.database().ref('tasks').push();
      await newTaskRef.set({
        creatorId: createTaskDto.creatorId,
        userId: createTaskDto.userId,
        task: createTaskDto.task,
        status: createTaskDto.status,
        num: createTaskDto.num
      });
      return {id: newTaskRef.key} ;

    }catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });

    }
  }


  async findAll(){
    try{
      const taskRef = firebaseAdmin.database().ref('tasks');
      const snapshot = await taskRef.once('value'); // Fetch the data once
      const tasks = this.transformTasks(snapshot.val()); // Extract the data from the snapshot
      return tasks; // Return the tasks
    }catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }
  async findAllForUser(id:string) {
    try{
      const allTasks = await this.findAll();
      const sortedTasks = allTasks.filter( (el) =>{
        return el.userId === id;
      })
      return sortedTasks;
    } catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try{
      const taskRef = firebaseAdmin.database().ref(`tasks/${id}`);
      await taskRef.update(updateTaskDto);
      return {message: `This action updates a #${id} task`};
    }catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }



  async remove(id: string) {
    try {
      const taskRef = firebaseAdmin.database().ref(`tasks/${id}`);
      await taskRef.remove();
      return { message: 'Task deleted successfully!' };
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }
}
