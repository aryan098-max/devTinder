function User(firstName, lastName){

    // an empty obj is created and assigned to this 

    this.firstName = firstName;
    this.lastName = lastName;

    // this is returned implicitly

}

// this method is similar to userSchema.methods - User model has these methods saved inside its' proto\
// Therefore, the this inside the this protoype is the user1
User.prototype.giveIntro = function(){
    
    console.log(this.firstName, this.lastName);
}

const user1 = new User("Aryan", "Gupta");
user1.giveIntro();