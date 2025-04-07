import { eq } from 'drizzle-orm';
import { agentOrBroker } from '../db/schema';

export async function getExclusiveVendors(db: App.Locals['db']) {
	return await db.query.exclusiveVendor.findMany({
		with: {
			user: {
				with: {
					agentOrBroker: {
						columns: {
							imageAlt: true,
							imageId: true,
							instagramUserName: true,
							displayName: true
						}
					},
					userData: {
						columns: {
							name: true,
							phoneNumber: true,
							countryCode: true
						}
					}
				},
				columns: {
					id: false,
					facebookId: false,
					googleId: false
				}
			}
		}
	});
}

export type ExclusiveVendors = Awaited<ReturnType<typeof getExclusiveVendors>>;

export async function getVendorId(db: App.Locals['db'], displayName: string) {
	const vendorId = await db.query.agentOrBroker.findFirst({
		where: eq(agentOrBroker.displayName, displayName)
	});
	return vendorId;
}
