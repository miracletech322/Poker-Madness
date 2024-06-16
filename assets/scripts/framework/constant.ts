export interface ICarInfo {
    ID: number;
    model: string;
    type: number;
    num: number;
}

export class constant {

    public static GAME_NAME = 'car';

    public static LOCAL_CACHE = {
        PLAYER: 'player',             
        SETTINGS: 'settings',         
        DATA_VERSION: 'dataVersion',   
        ACCOUNT: 'account',                 
        // TMP_DATA: 'tmpData',             
        HISTORY: "history",                 
        BAG: "bag",                         
    }

    public static MAX_LEVEL = 20;        

    public static MIN_CAR_ID = 101;
    public static MAX_CAR_ID = 109;

    public static AUDIO_SOUND = {
        BACKGROUND: 'background',       

        CRASH: "crash",             
        GET_MONEY: "getMoney",      
        IN_CAR: "inCar",            
        NEW_ORDER: "newOrder",      
        CAR_START: "carStart",      
        WIN: "win",                 
        STOP: "stop",         
        TOOTING1: "tooting1",       
        TOOTING2: "tooting2",     
    }
    
    public static SIGNIN_REWARD_STATUS = {
        RECEIVED: 0, 
        RECEIVABLE: 1, 
        UNRECEIVABLE: 2,
        FILL_SIGNIN: 3, 
        AFTER_FILL_SIGNIN: 4, 
    } 

    public static MAX_SIGNIN_DAY = 7 

    public static NORMAL_SHOW_TIME = 3

    public static NEWBEE_LEVEL = 2;


    public static REWARD_TYPE = {
        DIAMOND: 1, 
        GOLD: 2,
        CAR: 3 
    }

    public static ONLINE = {
        MAX_TIME: 60,            
        // MAX_TIME: 60,            
        PROFIT_PER_SECOND: 0.3,       
        TIME_PER_CIRCLE: 10         
    }

    public static SHARE_FUNCTION = {
        BALANCE: 'balance',                 
        RELIVE: 'relive',                 
        OFFLINE: 'offline',          
        RANK: 'rank',                   
        LOTTERY: 'lottery',              
        LOTTERY_REWARD: 'lotteryReward',    
        TRIAL: 'trial',                
        CLICK_BOX: 'clickBox',     
        ONLINE: 'online',          
        SIGNIN: 'signIn',              
        FILL_SIGNIN: 'fillSignIn',      
        INVINCIBLE: 'invincible',       
        SHOP_SHARE: 'shopShare',              
        SHOP_VIDEO: 'shopVideo',                  
    }

    public static INITIAL_CAR = 1;

    public static BUY_CAR_TYPE = {
        GOLD: 1,         
        LOGIN: 2,      
        CONTINUOUS_LOGIN: 3,
        SHARE: 4,    
        VIDEO: 5,    
        GAME: 6,    
        INVITE: 7, 
        SIGNIN: 8,    
        PASS_LEVEL: 9  
    }

    public static OPEN_REWARD_TYPE = {
        AD: 0,
        SHARE: 1,
        NULL: 2
    }   
    
    public static GOLD_REWARD = {
        SECOND: 500,
        SEVENT: 500
    }  

    public static LOTTERY = {
        MONEY: 2000,            
        EXCHANGE: 500       
    }

    public static CUSTOMER_MAX_CNT = 2;
    public static MENU_INIT_BOTTOM = 40; 
    public static MENU_BOTTOM = 250;
}
