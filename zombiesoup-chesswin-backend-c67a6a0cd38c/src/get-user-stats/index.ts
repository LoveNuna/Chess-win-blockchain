import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';
import * as mysqlL from 'mysql';
import { LOAD_USER_STATS } from './Queries';
const mysql = mysqlL;


let connection;

export const handler = async (event: any = {}): Promise<any> => {
    if (!connection) {
        initializeConnection();
    }

    const userId = event.userId;


    try {

        const userStats: any = (await loadUserStats(userId)) as any[];

        const stats = {
            gamesWon: [],
            gamesLost: [],
            gamesDrawed: [],
            gamesInProgress: []
        }

        userStats.forEach((item: any) => {

            const game: any = {};
            game.id = item.game_id;
            game.status = item.status;
            game.fairPlayEnabled = item.fair_play_enabled;
            game.gameTimeType = item.game_time_type;
            game.points = item.points;
            game.type = item.type;
            game.startDate = item.startDate;
            game.opponent = {
                id: item.player_id,
                name: item.name,
                email: item.email,
                profilePicture: item.profile_picture,
                country: item.country
            }


            if (game.status == 1) {
                stats.gamesInProgress.push(game);
            }

            else if (game.status == 2 || game.status == 4) {

                if (item.winner_id.trim() == userId) {
                    stats.gamesWon.push(game);
                } else {
                    stats.gamesLost.push(game);
                }

            }

            else if (game.status == 3) {
                stats.gamesDrawed.push(game);
            }


        });


        return {
            success: true,
            stats
        }
    } catch (e) {
        console.log('game-finished-error : ', e);
        return {
            success: false
        }
    }


}


const loadUserStats = (userId: string) => {

    const params = {
        userId
    }

    return new Promise((resolve, eject) => {
        connection.query(LOAD_USER_STATS, params, function (error, results, fields) {
            if (error) {
                eject(error);
            }
            else {
                resolve(results)
            }
        });
    });

}


const initializeConnection = () => {
    connection = mysql.createConnection({
        host: CONSTANTS.CHESSF_MYSQL_HOST,
        user: CONSTANTS.CHESSF_MYSQL_USER,
        password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
        database: CONSTANTS.CHESSF_MYSQL_DATABASE
    });

    //change query format config to use name parameters
    connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };
}

