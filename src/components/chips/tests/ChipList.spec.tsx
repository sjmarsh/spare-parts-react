import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect } from 'vitest';

import ChipList from '../ChipList';
import Chip from '../types/chip';
import ChipColor from '../types/chipColor';

describe('chipList', () => {

    it('should render chipList', () => {

        const chips = new Array<Chip>(
            { id: '1', name: 'Chip 1', isActive: true, color: ChipColor.AliceBlue, tooltip: 'The 1st Chip' },
            { id: '2', name: 'Chip 2', isActive: false, color: ChipColor.HoneyDew, tooltip: 'The 2nd Chip' },
            { id: '3', name: 'Chip 3', isActive: true, color: ChipColor.Lavender, tooltip: 'The 3rd Chip' },
        )
        const theTitle = "My Chips";
        let toggledChip: Chip | null;
        const handleChipToggle = (chip: Chip) => {
            toggledChip = chip;
        }

        render(
            <ChipList chips={chips} title={theTitle} onToggleChip={handleChipToggle} />
        )

        const renderedTitle = screen.getByText(theTitle);
        expect(renderedTitle).toBeInTheDocument();
        const renderedChips = screen.getAllByRole('option');
        expect(renderedChips.length).toBe(3);
        expect(renderedChips.map(c => c.textContent)).toEqual(['Chip 1', 'Chip 2', 'Chip 3']);
        expect(renderedChips[0].className).toContain(ChipColor.AliceBlue);
        expect(renderedChips[1].className).toContain(ChipColor.HoneyDew);
        expect(renderedChips[2].className).toContain(ChipColor.Lavender);
        expect(renderedChips[0].className).not.toContain('Outlined');
        expect(renderedChips[1].className).toContain('Outlined');
        expect(renderedChips[2].className).not.toContain('Outlined');
    })

    it('should toggle chip', async () => {

        const user = userEvent.setup();
        const chips = new Array<Chip>(
            { id: '1', name: 'Chip 1', isActive: true, color: ChipColor.AliceBlue, tooltip: 'The 1st Chip' },
            { id: '2', name: 'Chip 2', isActive: false, color: ChipColor.HoneyDew, tooltip: 'The 2nd Chip' },
            { id: '3', name: 'Chip 3', isActive: true, color: ChipColor.Lavender, tooltip: 'The 3rd Chip' },
        )
        const theTitle = "My Chips";
        let toggledChip: Chip | null = null;
        const handleChipToggle = (chip: Chip) => {
            toggledChip = chip;
        }

        render(
            <ChipList chips={chips} title={theTitle} onToggleChip={handleChipToggle} />
        )

        const renderedChips = screen.getAllByRole('option');
        const chip1Icon = renderedChips[0].children[0].children[0];

        await user.click(chip1Icon);
        expect(toggledChip).not.toBeNull();
        expect(toggledChip!.isActive).toBeFalsy();

        await user.click(chip1Icon);
        expect(toggledChip!.isActive).toBeTruthy();
    })

})