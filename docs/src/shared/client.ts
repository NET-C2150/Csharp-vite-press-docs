﻿import {JsonServiceClient} from '@servicestack/client'
let url = import.meta.env.DEV ? 'https://localhost:5001' : 'https://chinook.netcore.io';
let client = new JsonServiceClient(url)
export default client
