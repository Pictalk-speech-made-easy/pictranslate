import dayjs from "dayjs";

export const survey_milestones = [3, 15, 60, 120];
export const rate_milestones = [15]
export const useAnalytics = defineStore('analytics', {
        state: () => ({
                modal: {
                        rate: false,
                        survey: false,
                },
                lastRatePopup: null as string | null,
                lastSurveyPopup: null as string | null,
                statistics: {
                        daysOfUse: 0,
                        lastLogin: null as string | null,
                },
                lastRateMilestone: 0,
                lastSurveyMilestone: 0,
        }),
        persist: {
                storage: persistedState.localStorage,
                paths: ['lastRatePopup', 'lastSurveyPopup', 'statistics.daysOfUse', 'statistics.lastLogin', 'lastRateMilestone', 'lastSurveyMilestone'],
        },
        actions: {
                /**
                 * @description the init function updates the daysOfUse and lastLogin stats
                 */
                init(){
                        const isDifferentDay = dayjs(this.statistics.lastLogin).diff(dayjs(), 'days') > 0
                        if(isDifferentDay) this.statistics.daysOfUse += 1
                        this.statistics.lastLogin = dayjs().format();
                },
                shouldRate(){
                        return rate_milestones.includes(this.statistics.daysOfUse) && this.lastRateMilestone < this.statistics.daysOfUse;
                },
                shouldSurvey(){
                        return survey_milestones.includes(this.statistics.daysOfUse) && this.lastSurveyMilestone < this.statistics.daysOfUse;
                }
        }
});
