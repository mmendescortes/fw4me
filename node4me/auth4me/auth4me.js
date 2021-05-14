module.exports = class auth4me {
	constructor(provider) {
		this.provider = provider;
	}
	signin(username, password){
		return this.provider.signin(username.toLowerCase(), password);
	}
	signup(username, password, email=false){
		return email ? this.provider.signup(username.toLowerCase(), password, email.toLowerCase()) : this.provider.signup(username.toLowerCase(), password, username.toLowerCase() + "@example.com");
	}
	signout(){
	}
	password(id, password){
		return this.provider.password(id, password);
	}
	email(id, email){
		return this.provider.email(id, email);
	}
};