import supabase from '../../supabase';
import { logActivity } from '@/helpers/activityLogger';

function errorMessage(error) {
    Swal.fire({
        icon: 'error',
        title: 'An Error occurred',
        text: `Error: ${error.message}`,
        confirmButtonText: 'Close',
        customClass: {
            confirmButton: 'swal2-confirm'
        }
    });
};

export default {
    namespaced: true,
    state: () => ({
        company: {
            name: "",
            location: "",
            estYear: "",
            phoneNumber: "",
            email: "",
            license: "",
            vessels: []
        }
    }),
    mutations: {
        SET_COMPANY(state, { companyData, vessel }) {
            state.company = {
                ...state.company,
                name: companyData.name || "",
                location: companyData.location || "",
                estYear: companyData.est_year || "",
                phoneNumber: companyData.phone_number || "",
                email: companyData.email || "",
                license: companyData.license || "",
                logo: companyData.logo || "",
                vessels: vessel
            };
        }
    },
    actions: {
        async fetchCompanyInfo({ commit, rootState }, companyId) {
            try {
                const { data, error } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('id', companyId)
                    .single();

                if (error) {
                    console.error('Error fetching company info:', error);
                } else {
                    let vessel = rootState.vessel.vessels;
                    let companyData = data;
                    localStorage.setItem('company_id', companyData.id);
                    commit('SET_COMPANY', { companyData, vessel });
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        },

        async updateCompanyInfo({ commit, rootState }, {formValues, changedFields}) {
            const Info = formValues;
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('company_id')
                    .eq('id', session.user.id)
                    .single();

                // Build payload safely
                const updatePayload = {
                    name: Info.name,
                    location: Info.location,
                    est_year: Info.estYear,
                    phone_number: Info.phoneNumber,
                    email: Info.email,
                    license: Info.license,
                    logo: Info.logo
                };

                // Update in Supabase. we need a method to compare vesselId and component.
                const { data, companyError } = await supabase
                    .from('companies')
                    .update(updatePayload)
                    .eq('id', profile.company_id);

                if (companyError) {
                    errorMessage(error)
                    return;
                } else {
                    let vessel = rootState.vessel.vessels;
                    let companyData = updatePayload;
                    // update activity log.
                    await logActivity({
                        id: profile.company_id,
                        action: 'update',
                        table: 'companies',
                        details: { status: `Edited company information`, information: changedFields }
                    });
                    commit('SET_COMPANY', { companyData, vessel });
                }
            }
        }
    },
    getters: {
        company: (state) => state.company
    }
};
