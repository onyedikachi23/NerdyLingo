/** @format */

import * as usersSchema from "@/users/users.schema";
import * as vtSchemas from "@/voice-translate/voice-translate.schema";

const schema = {
	...usersSchema,
	...vtSchemas,
};

export default schema;
