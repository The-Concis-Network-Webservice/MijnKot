export type Dictionary = {
    navigation: {
        home: string;
        rent: string;
        faq: string;
        contact: string;
        admin: string;
        locations: string;
        rent_academic: string;
        rent_semester: string;
        rent_erasmus: string;
        rent_view_all: string;
        plan_visit: string;
        no_locations: string;
        about: string;
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
            cta: string;
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
    vestigingen: {
        title: string;
        description: string;
        view_location: string;
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
        view_photos: string;
        loading_photos: string;
        photo_main_alt: string;
        view: string;
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
        submitting: string;
        success_title: string;
        success_desc: string;
        send_another: string;
        error_sending: string;
        socials_label: string;
    };
    booking: {
        badge: string;
        title: string;
        desc: string;
        cta: string;
        fine_print: string;
        plan_visit: string;
        free_no_obligations: string;
    };
    sticky: {
        per_month: string;
        all_included: string;
        included: string;
        act_fast: string;
        act_fast_desc: string;
        contact_button: string;
        send_message: string;
        call_us: string;
    };
    modal: {
        title: string;
        desc: string;
        name_placeholder: string;
        phone_placeholder: string;
        email_placeholder: string;
        consent: string;
        submit: string;
        loading: string;
        no_spam: string;
        close: string;
        success_title: string;
        success_desc: string;
        error_phone: string;
        error_consent: string;
        error_generic: string;
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
        plan_visit: string;
    };
    common: {
        available: string;
        unavailable: string;
        coming_soon: string;
        rented: string;
        reserved: string;
        price_per_month: string;
        read_more: string;
        read_less: string;
        arrow: string;
        no_data: string;
        loading: string;
        error: string;
        no_photo: string;
        view: string;
        more_info: string;
        logout: string;
        new: string;
        detail: string;
        update_success: string;
        delete_confirm: string;
        delete_success: string;
    };
    status: {
        available: string;
        option: string;
        rented: string;
        reserved: string;
        pending: string;
        draft?: string;
        published?: string;
        archived?: string;
        hidden?: string;
    };
    kotaanbod: {
        label: string;
        title: string;
        description: string;
        student_rooms: {
            title: string;
            size: string;
            desc: string;
        };
        duplex: {
            title: string;
            size: string;
            desc: string;
        };
        studios: {
            title: string;
            size: string;
            desc: string;
        };
        studios_terrace: {
            title: string;
            size: string;
            desc: string;
        };
        double_rooms: {
            title: string;
            size: string;
            desc: string;
        };
    };
    over_ons: {
        hero: {
            badge: string;
            title: string;
            title_highlight: string;
            desc: string;
            btn_rooms: string;
            btn_visit: string;
        };
        stats: {
            buildings: string;
            kotlabel: string;
            fire: string;
            fees: string;
        };
        story: {
            label: string;
            title: string;
            p1: string;
            p2: string;
            p2_strong: string;
            p3: string;
        };
        features: {
            f1_title: string;
            f1_desc: string;
            f2_title: string;
            f2_desc: string;
            f3_title: string;
            f3_desc: string;
            f4_title: string;
            f4_desc: string;
        };
        values: {
            label: string;
            title: string;
            items: {
                title: string;
                desc: string;
            }[];
        };
        steps: {
            label: string;
            title: string;
            btn: string;
            btn_sub: string;
            items: {
                title: string;
                desc: string;
            }[];
        };
        locations: {
            label: string;
            title: string;
            desc: string;
            btn_view: string;
            btn_all: string;
        };
        contact: {
            title: string;
            desc: string;
            btn_contact: string;
            btn_visit: string;
        };
    };
    admin: {
        common: {
            save: string;
            saving: string;
            cancel: string;
            delete: string;
            edit: string;
            create: string;
            search: string;
            actions: string;
            status: string;
            all_vestigingen: string;
            back: string;
            suggest_en: string;
            order: string;
            all_locations: string;
            logged_in: string;
            open_menu: string;
            save_changes: string;
            add: string;
            name: string;
            category: string;
            change_password: string;
            time: string;
            action: string;
            entity: string;
            user: string;
            system: string;
            update_error?: string;
            update_success?: string;
            published_success?: string;
            publish_now?: string;
            archive_confirm?: string;
            archived_success?: string;
            archive_kot?: string;
            translated_success?: string;
            translate_error?: string;
            translate_network_error?: string;
            contracts?: string;
            generate_contract_confirm?: string;
            contract_created?: string;
            contract_error?: string;
            make_contract?: string;
            contract_desc?: string;
        };
        view: {
            locations: string;
            koten: string;
            media: string;
            faq: string;
            leads: string;
            settings: string;
            logs: string;
            users: string;
        };
        settings: {
            title: string;
            description: string;
            tabs: {
                general: string;
                categories: string;
                popups: string;
                security: string;
            };
            general: {
                homepage_content: string;
                hero_title: string;
                hero_subtitle: string;
                cta_label: string;
                cta_href: string;
                booking_url: string;
                contact_email: string;
                contact_phone: string;
                contact_address: string;
                company_name: string;
                company_legal_name: string;
            };
            popups: {
                notice_title: string;
                notice_desc: string;
                notice_text: string;
                popup_title: string;
                popup_desc: string;
                popup_headline: string;
                popup_text: string;
            };
            security: {
                desc: string;
            };
        };
        vestigingen: {
            title: string;
            description: string;
            create: string;
            detail: string;
            edit: string;
            edit_desc: string;
            name: string;
            address: string;
            city: string;
            postal_code: string;
            cover_photo: string;
            description_nl: string;
            description_en: string;
            existing: string;
            slug: string;
            all_locations: string;
            floor_plan: string;
            public_page: string;
            copy_link: string;
            copied: string;
            loading: string;
        };
        koten: {
            title: string;
            description: string;
            create: string;
            detail: string;
            edit: string;
            edit_desc: string;
            existing: string;
            price: string;
            field_title: string;
            desc_markdown: string;
            desc_placeholder: string;
            manage: string;
            no_koten: string;
            highlight?: string;
            en_title_placeholder?: string;
            save_error?: string;
            loading?: string;
            no_rent_types?: string;
            history_title?: string;
            no_history?: string;
        };
        faq: {
            create: string;
            existing: string;
            title_nl: string;
            title_en: string;
            content_nl: string;
            content_en: string;
        };
        audit_logs: {
            title: string;
            description: string;
            empty: string;
        };
        users: {
            title: string;
            description: string;
            restrict_msg: string;
            add_title: string;
            email_placeholder: string;
            password_placeholder: string;
            name_placeholder: string;
            existing_title: string;
            you: string;
            no_name: string;
            assigned_vestigingen: string;
            no_users: string;
            delete_self_error: string;
            delete_confirm: string;
        };
        leads: {
            title: string;
            loading: string;
            no_leads: string;
            email: string;
            name: string;
            phone: string;
            source: string;
            actions: string;
            delete_confirm: string;
            delete_error: string;
            delete_network_error: string;
            pagination_info: string;
            prev: string;
            next: string;
        };
        media: {
            title: string;
            description: string;
            uploading: string;
            drag_drop_title: string;
            drag_drop_subtitle: string;
            no_media: string;
            copy_url: string;
            copied: string;
            delete_ask: string;
            yes: string;
            no: string;
        };
    };
};

export type Locale = 'en' | 'nl';
