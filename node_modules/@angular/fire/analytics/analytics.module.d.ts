import { UserTrackingService, ScreenTrackingService } from './analytics.service';
import { AngularFireAnalytics } from './analytics';
export declare class AngularFireAnalyticsModule {
    constructor(analytics: AngularFireAnalytics, screenTracking: ScreenTrackingService, userTracking: UserTrackingService);
}
