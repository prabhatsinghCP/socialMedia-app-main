export const initialState=null

export const reducer= (state,action)=>{
    if(action.type==="USER")
    return action.payload
    if(action.type==="CLEAR")
    return null
    if(action.type==="UPDATE")
    {
        return {
            ...state,
            followers:action.payload.followers,
            followings:action.payload.followings
        }
    }
    if(action.type==="UPDATEPIC"){
        return {
            ...state,
            pic:action.payload
        }
    }
    if(action.type==="UPDATEINFO")
    {
        return {
            ...state,
            name:action.payload.name,
            email:action.payload.email
        }
    }
    return state
}