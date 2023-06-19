import * as mysqlL from 'mysql';
import { Exception } from './Exception';
import { CONSTANTS } from '../_helpers';
import { UPDATE_FRIEND_STATUS, DELETE_FRIEND_RECORD } from './Queries';
const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
    if (!connection) {
        initializeConnection();
    }

    // status 2 accept 
    // status 3 decline
    const status = event.status;

    try {

        if (status == 2) {
            await updateFriendStatus(status, event.playerId, event.userId);
        } else if (status == 3) {
            await deleteFriendRecord(event.playerId, event.userId);
        }

        return {
            success: true
        }

    } catch (e) {
        console.log('lambda-error : ', e)
        return {
            success: false,
            error: Exception.ERROR
        }
    }

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


const updateFriendStatus = (status: number, friendId: any, userId: string) => {

    const params = { status: status + '', userId, friendId }

    return new Promise((resolve, eject) => {
        connection.query(UPDATE_FRIEND_STATUS, params, function (error, results, fields) {
            if (error) {
                eject(error);
            }
            else {
                resolve(results)
            }
        });
    });
}


const deleteFriendRecord = (friendId: any, userId: string) => {

    const params = { userId, friendId }

    return new Promise((resolve, eject) => {
        connection.query(DELETE_FRIEND_RECORD, params, function (error, results, fields) {
            if (error) {
                eject(error);
            }
            else {
                resolve(results)
            }
        });
    });
}
