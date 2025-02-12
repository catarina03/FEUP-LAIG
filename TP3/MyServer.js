/**
 * Server class, Represents a server that creates a connection to the Prolog program
 */
class MyServer extends CGFobject{
    /**
     * @constructor
     */
    constructor(scene) {
        super(scene);
        this.port = 8081;
    };

    /**
     * default on success function
     * @param  {string} data response from the XMLHttpRequest
     */
    onSuccess(data) {
        console.log(data.target.response);
    };

    /**
     * default on error function
     * @param  {string} data response from the XMLHttpRequest
     */
    onError(data) {
        document.getElementById("error").innerText = "No connection";
    };

    /**
     * [makeRequest description]
     * @param  {string} requestString prolog command
     * @param  {function} onSuccess   function that is run on request success
     */
    makeRequest(requestString, onSuccess) {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);

        request.onload = onSuccess;
        request.onerror = this.onError;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

};