import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class TeamService {
  transformTeams(data: Record<string, any>): any[] {
    return Object.entries(data).map(([id, task]) => ({
      id, // Use the key as the 'id' property
      ...task, // Spread the task properties
    }));
  }
  async create(createTeamDto: CreateTeamDto) {
    try{
      const newTeamRef = firebaseAdmin.database().ref('teams').push();
      await newTeamRef.set(createTeamDto);
      return {id: newTeamRef.key} ;

    }catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });

    }
  }

  async findAll() {
    try{
      const teamRef = firebaseAdmin.database().ref('teams');
      const snapshot = await teamRef.once('value'); // Fetch the data once
      const teams = this.transformTeams(snapshot.val()); // Extract the data from the snapshot
      return teams; // Return the teams
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
      const allTeams = await this.findAll();
      const sortedTeams = allTeams.filter( (el) =>{
        let flag = false;
        if(el.members){
          el.members.forEach( member =>{
            if (member === id){
              flag = true
            }
          })
        }       
        return flag;
      })
      return sortedTeams;
    } catch(err){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err
      });
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
