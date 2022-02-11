import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomCard from './custom-card.component';
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import userEvent from '@testing-library/user-event';

describe('Tests for CustomCard', () => {
    test('Custom Card matches the snapshot', () => {
        const history = createMemoryHistory();
        const wrapper = render(
            <Router history={history}>
                <CustomCard
                    imageUrl="#"
                    title="Test"
                    children={null}
                    to="/test"
                    buttonText="Button Text"
                    header="View Test"
                />
            </Router>
        );

        expect(wrapper).toMatchSnapshot();
    });

    it('should go to the correct url when card is clicked', () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <CustomCard
                    imageUrl="#"
                    title="Test"
                    children={null}
                    to="/test"
                    buttonText="Button Text"
                    header="View Test"
                />
            </Router>
        );

        expect(screen.queryByText(/button text/i)).toBeInTheDocument();

        screen.getByText(/button text/i).click();
        expect(history.location.pathname).toBe("/test");
    });
});
