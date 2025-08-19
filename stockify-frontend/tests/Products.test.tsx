import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Products from '../src/pages/Products';
import {vi} from 'vitest';
import '@testing-library/jest-dom';
import api from "../src/lib/axios";

vi.mock('../src/lib/axios');

describe('Products Page', () => {
    beforeEach(() => {
        vi.mocked(api.get).mockResolvedValue({data: []});
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders product form and table', () => {
        render(
            <MemoryRouter>
                <Products/>
            </MemoryRouter>
        );
        expect(screen.getByText('Add New Product')).toBeInTheDocument();
        expect(screen.getByText('Product List')).toBeInTheDocument();
    });
});