import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import * as debug from 'debug';

const log = debug('agenda:mock-mongodb');

export interface IMockMongo {
	disconnect: () => void;
	mongo: MongoClient;
	mongod: MongoMemoryServer;
	uri: string;
}

export async function mockMongo(): Promise<IMockMongo> {
	const self: IMockMongo = {} as any;
	self.mongod = await MongoMemoryServer.create({
		binary: {
			version: process.env.MONGODB_VERSION,
		},
	});
	const uri = self.mongod.getUri();
	log('mongod started', uri);
	self.mongo = await MongoClient.connect(uri);
	self.disconnect = function () {
		self.mongod.stop();
		log('mongod stopped');
		self.mongo.close();
	};
	self.uri = uri;

	return self;
}
