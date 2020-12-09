import React, { useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import { Portal } from '../Portal';
import CurrentFilters from './CurrentFilters';
import FilterBlock from './filterBlock';
import FilterFooter from './filterFooter';
import defaultClasses from './filterModal.css';

import {FocusScope, useFocusManager} from '@react-aria/focus'

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const talonProps = useFilterModal({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        handleReset,
        isOpen
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const modalClass = isOpen ? classes.root_open : classes.root;
    const modalRef = useRef(null);

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items]) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);

                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        group={group}
                        items={items}
                        name={groupName}
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState]
    );

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton type="button" onClick={handleReset}>
                <FormattedMessage
                    id={'filterModal.action'}
                    defaultMessage={'Clear all'}
                />
            </LinkButton>
        </div>
    ) : null;

    function handleKeyActions(event) {
        if (isOpen) {
            if (event.keyCode === 27) {
                handleClose(event);
            }
        }
    }

    return (
        <Portal>
            <FocusScope autoFocus restoreFocus contain>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <aside
                    className={modalClass}
                    ref={modalRef}
                    onKeyDown={handleKeyActions}
                    role="dialog"
                >
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                <FormattedMessage
                                    id={'filterModal.headerTitle'}
                                    defaultMessage={'Filters'}
                                />
                            </h2>
                            <button onClick={handleClose} aria-label="close">
                                <Icon src={CloseIcon} />
                            </button>
                        </div>
                        <CurrentFilters
                            filterApi={filterApi}
                            filterNames={filterNames}
                            filterState={filterState}
                        />
                        {clearAll}
                        <ul className={classes.blocks} aria-label="Filters">
                            {filtersList}
                        </ul>
                    </div>
                    <FilterFooter
                        applyFilters={handleApply}
                        hasFilters={!!filterState.size}
                        isOpen={isOpen}
                    />
                </aside>
            </FocusScope>
        </Portal>
    );
};

FilterModal.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    )
};

export default FilterModal;
