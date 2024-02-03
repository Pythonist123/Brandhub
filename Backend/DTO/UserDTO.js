
 class UserDTO{
    constructor(_id,email){
        this._id = _id;
        this.email = email;
    }

    getProperties(){
        return {
            _id :this._id,
            email:this.email
        }
    }
}

export default UserDTO