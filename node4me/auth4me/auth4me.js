module.exports = class auth4me {
	constructor(provider) {
		this.provider = provider;
	}
	signin(username, password){
		typeof username === String ? username.toLowerCase() : username;
		return this.provider.signin(username.toLowerCase(), password);
	}
	signup(username, password, email=false){
		typeof username === String ? username.toLowerCase() : username;
		typeof email === String ? email.toLowerCase() : email;
		return email ? this.provider.signup(username.toLowerCase(), password, email.toLowerCase()) : this.provider.signup(username.toLowerCase(), password, username.toLowerCase() + "@example.com");
	}
	signout(){
	}
	password(id, password){
		return this.provider.password(id, password);
	}
	email(id, email){
		typeof email === String ? email.toLowerCase() : email;
		return this.provider.email(id, email.toLowerCase());
	}
};