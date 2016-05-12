/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var log2out = require('log2out');

function MongoDriver(persistence,  mongoClient) {
	this.persistence = persistence;
	this.mongoClient = mongoClient || require('mongodb').MongoClient;
	this.logger = log2out.getLogger("MongoDriver");
}

MongoDriver.prototype.connect = function(objectCallback) {
	var self = this;
    var mongoUrl = 'mongodb://' + this.persistence.host + ':' + this.persistence.port + '/' + this.persistence.db;
	this.mongoClient.connect(mongoUrl, function(err, db) {
		if (err) {
			self.logger.error("Can't connect to mongo: ", mongoUrl, err);
			objectCallback.setMongoStarted(false);
			process.exit(42);
            return;
		}
		self.db = db;
		self.logger.info('Connected to mongo:', mongoUrl);
		objectCallback.setMongoStarted(true);
	});
};

MongoDriver.prototype.getCollection  = function (collectionName) {
	return this.db.collection(collectionName);
};

module.exports = MongoDriver;
