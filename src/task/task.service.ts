import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class TaskService {
  async create(createTaskDto: CreateTaskDto) {
    try{
      const newTaskRef = firebaseAdmin.database().ref('tasks').push();
      await newTaskRef.set({
        userId: createTaskDto.userId,
        task: createTaskDto.task,
        status: createTaskDto.status
      });
      return { message: 'Task created successfully!' };

    }catch(err){
      return {error: err}

    }
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
