import { ErrorCode ,HttpException} from "./root";//clas shuoud b eexpoorted
export class BadRequestsException extends HttpException{
    constructor(message:string,errorCode:ErrorCode){
        super(message,errorCode,404,null)

    }
}
