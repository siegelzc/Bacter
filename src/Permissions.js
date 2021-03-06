class Permissions {
    /**
     * Construct a new Permissions instance
     * @param title The title of the relevant game
     * @param password The password to the game
     */
    constructor(title, password='') {
        this.title = title;
        this.password = password;
        this.permissed = [];
    }

    /**
     * Is the specified id permissed?
     * @param  {String}  id A socket.id identification hash
     * @return {Boolean}    true if permissed, else false
     */
    isPermissed(id) {
        return this.permissed.indexOf(id) !== -1;
    }

    /**
     * Permiss the user with the specified id
     * @param  {String} id A socket.id identification hash
     * @return {int}       0 if successful, else 1
     */
    permiss(id) {
        if (id) {
            this.permissed.push(id);
            return 0;
        }
        console.error('Error: Permission.permiss -- id is invalid');
        return 1;
    }

    /**
     * Revoke the user's permission with the specified id
     * @param  {String} id A socket.id identification hash
     * @return {int}       0 if successful, else 1
     */
    revoke(id) {
        let index = this.permissed.indexOf(id);
        if (index !== -1) {
            this.permissed.splice(index, 1);
            return 0;
        }
        console.error('Error: Permission.revoke -- Index of ' + id + ' not found in this.permissed');
        return 1;
    }
}

module.exports = Permissions;
