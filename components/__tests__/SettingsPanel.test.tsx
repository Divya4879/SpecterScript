import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SettingsPanel from '../SettingsPanel';

describe('SettingsPanel Component', () => {
  describe('Unit Tests', () => {
    it('should render with accessibility settings title', () => {
      const { getByText } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      expect(getByText('Accessibility Settings')).toBeTruthy();
    });

    it('should render non-flicker mode toggle', () => {
      const { getByText } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      expect(getByText('Non-Flicker Mode')).toBeTruthy();
      expect(getByText('Disable rapid flickering and glitch animations')).toBeTruthy();
    });

    it('should render audio toggle', () => {
      const { getByText } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      expect(getByText('Ambient Audio')).toBeTruthy();
      expect(getByText('Enable haunted ambient sounds')).toBeTruthy();
    });

    it('should call onToggleFlicker when non-flicker toggle is clicked', () => {
      const mockToggleFlicker = jest.fn();
      const { getByRole } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={mockToggleFlicker}
          onToggleAudio={() => {}}
        />
      );

      const toggle = getByRole('switch', { name: /non-flicker/i });
      fireEvent.click(toggle);

      expect(mockToggleFlicker).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleAudio when audio toggle is clicked', () => {
      const mockToggleAudio = jest.fn();
      const { getByRole } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={mockToggleAudio}
        />
      );

      const toggle = getByRole('switch', { name: /audio/i });
      fireEvent.click(toggle);

      expect(mockToggleAudio).toHaveBeenCalledTimes(1);
    });

    it('should reflect nonFlickerMode state in toggle appearance', () => {
      const { getByRole, rerender } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      const toggle = getByRole('switch', { name: /non-flicker/i });
      expect(toggle.getAttribute('aria-checked')).toBe('false');

      rerender(
        <SettingsPanel
          nonFlickerMode={true}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      expect(toggle.getAttribute('aria-checked')).toBe('true');
    });

    it('should reflect audioEnabled state in toggle appearance', () => {
      const { getByRole, rerender } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      const toggle = getByRole('switch', { name: /audio/i });
      expect(toggle.getAttribute('aria-checked')).toBe('false');

      rerender(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={true}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      expect(toggle.getAttribute('aria-checked')).toBe('true');
    });

    it('should have proper ARIA attributes for accessibility', () => {
      const { getByRole } = render(
        <SettingsPanel
          nonFlickerMode={false}
          audioEnabled={false}
          onToggleFlicker={() => {}}
          onToggleAudio={() => {}}
        />
      );

      const flickerToggle = getByRole('switch', { name: /non-flicker/i });
      const audioToggle = getByRole('switch', { name: /audio/i });

      expect(flickerToggle.getAttribute('role')).toBe('switch');
      expect(audioToggle.getAttribute('role')).toBe('switch');
    });
  });
});
