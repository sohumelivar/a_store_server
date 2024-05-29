module.exports = class UserDto {
    username;
    id;
    isActivated;

    constructor(model) {
        this.username = model.username;
        this.id = model.id;
        this.isActivated = model.isActivated;
    }
}