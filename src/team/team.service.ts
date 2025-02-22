import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class TeamService {
  transformTeams(data: Record<string, any>): any[] {
    return Object.entries(data).map(([id, team]) => ({
      id, // Use the key as the 'id' property
      ...team, // Spread the task properties
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
        else if(el.adminId === id){
          flag = true
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


  async findOne(teamId: string) {
    try {
      const teamRef = firebaseAdmin.database().ref(`teams/${teamId}`); //Directly reference team by ID
      const snapshot = await teamRef.once('value');
  
      if (snapshot.exists()) {
        const team = {...snapshot.val(), id:teamId}; //Adapt transform function for single team
        console.log(team);
        return team;
      } else {
        return null; // Indicate team not found
      }
    } catch (err) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: err.message,
      }, HttpStatus.FORBIDDEN, {
        cause: err,
      });
    }
  }

  async update(teamId: string, updateTeamDto: UpdateTeamDto) {
    try {
      // Use ref() to directly reference the team by ID.  No need for push().
      const teamRef = firebaseAdmin.database().ref(`teams/${teamId}`);

      // Check if the team exists before updating.  This prevents errors.
      const teamSnapshot = await teamRef.once('value');
      if (!teamSnapshot.exists()) {
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }

      // Update the team data.  This merges the updateTeamDto with existing data.
      await teamRef.update(updateTeamDto);
      return { id: teamId };

    } catch (err) {
      // Improved error handling: More specific error messages.
      if (err.code === 'PERMISSION_DENIED') {
        throw new HttpException(
          'You do not have permission to update this team.',
          HttpStatus.FORBIDDEN,
        );
      } else if (err.code === 'NOT_FOUND') {
          throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }
      // Log the error for debugging purposes.  Do not expose full error details to client.
      console.error("Error updating team:", err);
      throw new HttpException('Failed to update team.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, userId:string) {
    try {
      const teamRef = firebaseAdmin.database().ref(`teams/${id}`);
      const team = (await teamRef.once('value')).val();
        await teamRef.remove();
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
