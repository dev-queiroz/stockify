import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import api from '../src/lib/axios';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../src/lib/axios');

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('submits login form', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: { access_token: 'mock-token' } });
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'pass123' });
            expect(localStorage.getItem('token')).toBe('mock-token');
        });
    });
});