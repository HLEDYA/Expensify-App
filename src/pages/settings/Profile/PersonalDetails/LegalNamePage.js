import _ from 'underscore';
import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import lodashGet from 'lodash/get';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import HeaderWithBackButton from '../../../../components/HeaderWithBackButton';
import withLocalize, {withLocalizePropTypes} from '../../../../components/withLocalize';
import ONYXKEYS from '../../../../ONYXKEYS';
import CONST from '../../../../CONST';
import * as ValidationUtils from '../../../../libs/ValidationUtils';
import TextInput from '../../../../components/TextInput';
import styles from '../../../../styles/styles';
import * as PersonalDetails from '../../../../libs/actions/PersonalDetails';
import compose from '../../../../libs/compose';
import Navigation from '../../../../libs/Navigation/Navigation';
import ROUTES from '../../../../ROUTES';
import usePrivatePersonalDetails from '../../../../hooks/usePrivatePersonalDetails';
import FullscreenLoadingIndicator from '../../../../components/FullscreenLoadingIndicator';
import * as ErrorUtils from '../../../../libs/ErrorUtils';
import FormProvider from '../../../../components/Form/FormProvider';
import InputWrapper from '../../../../components/Form/InputWrapper';

const propTypes = {
    /* Onyx Props */

    /** User's private personal details */
    privatePersonalDetails: PropTypes.shape({
        legalFirstName: PropTypes.string,
        legalLastName: PropTypes.string,
    }),

    ...withLocalizePropTypes,
};

const defaultProps = {
    privatePersonalDetails: {
        legalFirstName: '',
        legalLastName: '',
    },
};

const updateLegalName = (values) => {
    PersonalDetails.updateLegalName(values.legalFirstName.trim(), values.legalLastName.trim());
};

function LegalNamePage(props) {
    usePrivatePersonalDetails();
    const legalFirstName = lodashGet(props.privatePersonalDetails, 'legalFirstName', '');
    const legalLastName = lodashGet(props.privatePersonalDetails, 'legalLastName', '');
    const isLoadingPersonalDetails = lodashGet(props.privatePersonalDetails, 'isLoading', true);

    const validate = useCallback((values) => {
        const errors = {};

        if (!ValidationUtils.isValidLegalName(values.legalFirstName)) {
            ErrorUtils.addErrorMessage(errors, 'legalFirstName', 'privatePersonalDetails.error.hasInvalidCharacter');
        } else if (_.isEmpty(values.legalFirstName)) {
            errors.legalFirstName = 'common.error.fieldRequired';
        }
        if (values.legalFirstName.length > CONST.LEGAL_NAME.MAX_LENGTH) {
            ErrorUtils.addErrorMessage(errors, 'legalFirstName', ['common.error.characterLimitExceedCounter', {length: values.legalFirstName.length, limit: CONST.LEGAL_NAME.MAX_LENGTH}]);
        }

        if (!ValidationUtils.isValidLegalName(values.legalLastName)) {
            ErrorUtils.addErrorMessage(errors, 'legalLastName', 'privatePersonalDetails.error.hasInvalidCharacter');
        } else if (_.isEmpty(values.legalLastName)) {
            errors.legalLastName = 'common.error.fieldRequired';
        }
        if (values.legalLastName.length > CONST.LEGAL_NAME.MAX_LENGTH) {
            ErrorUtils.addErrorMessage(errors, 'legalLastName', ['common.error.characterLimitExceedCounter', {length: values.legalLastName.length, limit: CONST.LEGAL_NAME.MAX_LENGTH}]);
        }

        return errors;
    }, []);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            testID={LegalNamePage.displayName}
        >
            <HeaderWithBackButton
                title={props.translate('privatePersonalDetails.legalName')}
                onBackButtonPress={() => Navigation.goBack(ROUTES.SETTINGS_PERSONAL_DETAILS)}
            />
            {isLoadingPersonalDetails ? (
                <FullscreenLoadingIndicator style={[styles.flex1, styles.pRelative]} />
            ) : (
                <FormProvider
                    style={[styles.flexGrow1, styles.ph5]}
                    formID={ONYXKEYS.FORMS.LEGAL_NAME_FORM}
                    validate={validate}
                    onSubmit={updateLegalName}
                    submitButtonText={props.translate('common.save')}
                    enabledWhenOffline
                >
                    <View style={[styles.mb4]}>
                        <InputWrapper
                            InputComponent={TextInput}
                            inputID="legalFirstName"
                            name="lfname"
                            label={props.translate('privatePersonalDetails.legalFirstName')}
                            accessibilityLabel={props.translate('privatePersonalDetails.legalFirstName')}
                            accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                            defaultValue={legalFirstName}
                            maxLength={CONST.LEGAL_NAME.MAX_LENGTH + CONST.SEARCH_MAX_LENGTH}
                            spellCheck={false}
                        />
                    </View>
                    <View>
                        <InputWrapper
                            InputComponent={TextInput}
                            inputID="legalLastName"
                            name="llname"
                            label={props.translate('privatePersonalDetails.legalLastName')}
                            accessibilityLabel={props.translate('privatePersonalDetails.legalLastName')}
                            accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                            defaultValue={legalLastName}
                            maxLength={CONST.LEGAL_NAME.MAX_LENGTH + CONST.SEARCH_MAX_LENGTH}
                            spellCheck={false}
                        />
                    </View>
                </FormProvider>
            )}
        </ScreenWrapper>
    );
}

LegalNamePage.propTypes = propTypes;
LegalNamePage.defaultProps = defaultProps;
LegalNamePage.displayName = 'LegalNamePage';

export default compose(
    withLocalize,
    withOnyx({
        privatePersonalDetails: {
            key: ONYXKEYS.PRIVATE_PERSONAL_DETAILS,
        },
    }),
)(LegalNamePage);
