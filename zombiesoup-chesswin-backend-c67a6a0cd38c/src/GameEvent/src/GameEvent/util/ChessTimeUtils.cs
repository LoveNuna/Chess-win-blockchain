namespace GameEvent
{

    public class ChessTimeUtils
    {
        public static int gameTimeTypeToSec(int gameTimeType)
        {
            switch (gameTimeType)
            {
                case 1: //1min
                    return 60;
                case 2: //1min + 10 sec
                    return 60;
                case 3: //2min
                    return 120;
                case 4: //3min
                    return 180;
                case 5: //3min
                    return 180;
                case 6: //3min
                    return 180;
                case 7: //3min
                    return 180;
                case 8: //5min
                    return 300;
                case 9: //5min
                    return 300;
                case 10: //5min
                    return 300;
                case 11: //5min
                    return 300;
                case 12: //10min
                    return 600;
                case 13: //10min
                    return 600;
                case 14: //15min
                    return 900;
                case 15: //15min
                    return 900;
                case 16: //30min
                    return 1800;
                default: return 0;
            }
        }


        public static int getAdditionalSec(int gameTimeType)
        {
            switch (gameTimeType)
            {
                case 1: //1min
                    return 0;
                case 2: //1min + 10 sec
                    return 10;
                case 3: //2min
                    return 10;
                case 4: //3min
                    return 0;
                case 5: //3min
                    return 2;
                case 6: //3min
                    return 5;
                case 7: //3min
                    return 10;
                case 8: //5min
                    return 0;
                case 9: //5min
                    return 2;
                case 10: //5min
                    return 5;
                case 11: //5min
                    return 10;
                case 12: //10min
                    return 0;
                case 13: //10min
                    return 10;
                case 14: //15min
                    return 0;
                case 15: //15min
                    return 10;
                case 16: //30min
                    return 0;
                default: return 0;
            }
        }

    }


}