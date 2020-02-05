# frozen_string_literal: true

module VolcaShare
  module Keys
    class PatchViewModel < ApplicationViewModel
      include Shared
      # NOTE: All methods in this view model are stubs unless
      #   specified otherwise.

      def lfo_shape_saw
        true
      end

      def lfo_shape_tri
        true
      end

      def lfo_shape_square
        true
      end

      def lfo_trigger_sync
      end

      def step_trigger
      end

      def tempo_sync
      end
    end
  end
end
