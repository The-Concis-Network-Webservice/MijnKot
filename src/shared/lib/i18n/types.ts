export type Dictionary = {
    navigation: {
        home: string;
        rent: string;
        faq: string;
        contact: string;
        admin: string;
    };
    home: {
        hero: {
            title: string;
            subtitle: string;
            cta: string;
            secondary_cta: string;
            badge: string;
        };
        sections: {
            latest: string;
            latest_desc: string;
            locations: string;
            locations_desc: string;
        };
        rental_options: {
            erasmus_title: string;
            erasmus_desc: string;
            academic_title: string;
            academic_desc: string;
            prebooking_title: string;
            prebooking_desc: string;
        };
    };
    overview: {
        title: string;
        description: string;
        all_locations: string;
        no_results_title: string;
        no_results_desc: string;
        back_to_all: string;
    };
    detail: {
        ref_label: string;
        about_title: string;
        type_label: string;
        type_value: string;
        furnished_label: string;
        furnished_yes: string;
        furnished_no: string;
        per_month: string;
        utilities: string;
        utilities_value: string;
        deposit: string;
        deposit_value: string;
        request_visit: string;
        ask_question: string;
        documents_title: string;
        upload_prompt: string;
        upload_helper: string;
        upload_button: string;
        uploading: string;
        upload_success: string;
        privacy_notice: string;
        contract_title: string;
        contract_desc: string;
        sign_contract: string;
        preview_pdf: string;
        contract_signed_title: string;
        contract_signed_desc: string;
        no_photos: string;
        more_photos: string;
    };
    faq: {
        title: string;
        description: string;
        no_items: string;
    };
    contact: {
        title: string;
        description: string;
        email_label: string;
        phone_label: string;
        office_label: string;
        form_title: string;
        name_label: string;
        name_placeholder: string;
        email_placeholder: string;
        subject_label: string;
        subject_general: string;
        subject_viewing: string;
        subject_technical: string;
        message_label: string;
        message_placeholder: string;
        submit_button: string;
    };
    footer: {
        tagline: string;
        navigation_title: string;
        information_title: string;
        contact_title: string;
        privacy_policy: string;
        terms_of_service: string;
        cookie_settings: string;
        rights_reserved: string;
        platform_label: string;
    };
    common: {
        available: string;
        unavailable: string;
        coming_soon: string;
        rented: string;
        price_per_month: string;
        read_more: string;
        arrow: string;
        no_data: string;
        loading: string;
        error: string;
    };
    status: {
        available: string;
        option: string;
        rented: string;
        pending: string;
    };
};

export type Locale = 'en' | 'nl';
